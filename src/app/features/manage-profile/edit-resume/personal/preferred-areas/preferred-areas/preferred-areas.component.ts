import { NgClass } from '@angular/common';
import { Component, inject, input, OnChanges, signal, SimpleChanges, computed } from '@angular/core';
import { AccordionManagerService } from '../../../../../../shared/services/accordion.service';
import { MultiSelectComponent } from "../../../../../../shared/components/multi-select/multi-select.component";
import { CheckboxComponent } from "../../../../../../shared/components/checkbox/checkbox.component";
import { CookieService } from '../../../../../../core/services/cookie/cookie.service';
import { PreferredAreasService } from '../service/preferred-areas.service';
import { PreferredAreaItem, SkillCategory, LocationResponse, OrganizationResponse, mapPreferredAreasResponse } from '../model/preferred-areas.model';
import { SelectItem } from '../../../../../../shared/models/models';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideTranslocoScope, TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { AccordionMainBodyComponent } from "../../../../../../shared/components/accordion-main-body/accordion-main-body.component";

@Component({
  selector: 'app-preferred-areas',
  imports: [MultiSelectComponent, CheckboxComponent, ReactiveFormsModule, TranslocoModule, AccordionMainBodyComponent],
  providers: [provideTranslocoScope('editResumePreferredAreas')],
  templateUrl: './preferred-areas.component.html',
  styleUrl: './preferred-areas.component.scss'
})
export class PreferredAreasComponent implements OnChanges {

  // Created and Implemented by Md Fahim Rahman on May 29, 2025

  isPreferredSectionOpen = input(false)
  isPreferredFormOpen = signal(false)

  userGuidId: string | null = null

  preferredAreas: PreferredAreaItem[] = [];
  apiError: string | null = null;
  language: string = 'en'; // or get from user/session

  skillCategories: SkillCategory[] = [];
  skillCategoryApiError: string | null = null;

  functionalCategories: SkillCategory[] = [];
  specialSkilledCategories: SkillCategory[] = [];

  // white 1-29
  // blue 61-92,-11

  private id = "preferred"
  private accordionService = inject(AccordionManagerService)
  private cookieService = inject(CookieService)
  private preferredAreasService = inject(PreferredAreasService);
  private translocoService = inject (TranslocoService);

  // Writable signal for current language
  currentLanguage = signal(this.translocoService.getActiveLang());

  form: FormGroup;
  selectedFunctionalCategoryIds = signal<number[]>([]);
  selectedSpecialSkilledCategoryIds = signal<number[]>([]);
  functionalCategoryControls: { [key: number]: FormControl<boolean> } = {};
  specialSkilledCategoryControls: { [key: number]: FormControl<boolean> } = {};

  // --- Auto-suggestion state and logic ---
  insideLocationSuggestions = signal<LocationResponse[]>([]);
  insideLocationNoDataMessage = signal<string | null>(null);

  outsideLocationSuggestions = signal<LocationResponse[]>([]);
  outsideLocationNoDataMessage = signal<string | null>(null);

  organizationSuggestions = signal<OrganizationResponse[]>([]);
  organizationNoDataMessage = signal<string | null>(null);

  insideLocationControl = new FormControl<SelectItem[]>([], { nonNullable: true });
  selectedInsideLocationIds = signal<string[]>([]);

  selectedInsideLocations = computed(() => {
    // Always show chips for selected IDs, using the best available name
    const ids = this.selectedInsideLocationIds();
    // Build a map of all known locations (from suggestions and from selected items in the control)
    const knownLocations = new Map<string, string>();
    // Add all current suggestions
    this.insideLocationSuggestions().forEach(loc => {
      knownLocations.set(loc.locationID, loc.locationName);
    });
    // Add all selected items from the control (in case they are not in suggestions)
    (this.insideLocationControl.value || []).forEach(item => {
      if (item.value && item.label) {
        knownLocations.set(item.value, item.label);
      }
    });
    // Map ids to objects with the best available name
    return ids.map(id => ({
      locationID: id,
      locationName: knownLocations.get(id) || id
    }));
  });

  outsideLocationControl = new FormControl<SelectItem[]>([], { nonNullable: true });
  selectedOutsideLocationIds = signal<string[]>([]);

  selectedOutsideLocations = computed(() => {
    const ids = this.selectedOutsideLocationIds();
    const knownLocations = new Map<string, string>();
    this.outsideLocationSuggestions().forEach(loc => {
      knownLocations.set(loc.locationID, loc.locationName);
    });
    (this.outsideLocationControl.value || []).forEach(item => {
      if (item.value && item.label) {
        knownLocations.set(item.value, item.label);
      }
    });
    return ids.map(id => ({
      locationID: id,
      locationName: knownLocations.get(id) || id
    }));
  });

  organizationControl = new FormControl<SelectItem[]>([], { nonNullable: true });
  selectedOrganizationIds = signal<string[]>([]);

  selectedOrganizations = computed(() => {
    const ids = this.selectedOrganizationIds();
    const knownOrgs = new Map<string, string>();
    this.organizationSuggestions().forEach(org => {
      knownOrgs.set(org.orG_TYPE_ID, org.orG_TYPE_NAME);
    });
    (this.organizationControl.value || []).forEach(item => {
      if (item.value && item.label) {
        knownOrgs.set(item.value, item.label);
      }
    });
    return ids.map(id => ({
      orgTypeID: id,
      orgTypeName: knownOrgs.get(id) || id
    }));
  });

  // State for chips (used in both normal and edit views)
  functionalCategoriesChips = signal<{ id: number, name: string }[]>([]);
  specialSkilledCategoriesChips = signal<{ id: number, name: string }[]>([]);
  insideLocationsChips = signal<{ id: number, name: string }[]>([]);
  outsideLocationsChips = signal<{ id: number, name: string }[]>([]);
  organizationsChips = signal<{ id: number, name: string }[]>([]);

  constructor() {
    this.form = new FormGroup({
      functionalCategoryIds: new FormControl<number[]>([], { nonNullable: true }),
      specialSkilledCategoryIds: new FormControl<number[]>([], { nonNullable: true })
    });

    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage.set(lang);
    });
  }

  ngOnInit(): void {
    // const rawGuid = this.cookieService.getCookie('MybdjobsGId'); //uncomment this line for production
    // YiDiBES7YxSyYiJiZu00PlS7MTL9PxYyZxJcPiPlBiCuPFZ1BFPtBFVpUXJNeEU=  -- 7905076
    // ZiZuPid0ZRLyZ7S3YQ00PRg7MRgwPELyBTYxPRLzZESuYTU0BFPtBFVUIGL3Ung%3D  -- 241028

    // const rawGuid = this.cookieService.getCookie('MybdjobsGId'); // for development only
    // this.userGuidId = rawGuid ? decodeURIComponent(rawGuid) : null;

    this.userGuidId = 'YiDiBES7YxSyYiJiZu00PlS7MTL9PxYyZxJcPiPlBiCuPFZ1BFPtBFVpUXJNeEU='; // Temporary hardcoded value for development

    // this.fetchPreferredAreas();
    // this.fetchSkillCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(this.isPreferredSectionOpen() && !this.isOpen()) {
      const willOpen = !this.accordionService.isOpen(this.id)();
      this.toggle();
      if (willOpen) {
        this.fetchPreferredAreas();
        this.fetchSkillCategories();
      }
    }
  }

  isOpen() {
    return this.accordionService.isOpen(this.id)();
  }

  toggle() {
    this.accordionService.toggle(this.id);
  }

  onExpandClick() {
    const willOpen = !this.accordionService.isOpen(this.id)();
    this.toggle(); // toggles the accordion
    if (willOpen) {
      this.fetchPreferredAreas();
      this.fetchSkillCategories();
    }
  }

  onFormToggle(isOpen: boolean) {
  this.isPreferredFormOpen.set(!this.isPreferredFormOpen());
  if (isOpen) {
    this.openPreferredForm();
  }
}

  fetchPreferredAreas() {
    if (!this.userGuidId) return;
    this.preferredAreasService.getPreferredAreas(this.userGuidId, this.language).subscribe({
      next: (res) => {
        if (res.event?.eventType === 1) {
          const mapped = mapPreferredAreasResponse(res);
          this.functionalCategoriesChips.set(mapped.functionalCategories);
          this.specialSkilledCategoriesChips.set(mapped.specialSkilledCategories);
          // If no inside locations, set default 'Anywhere in Bangladesh'
          if (!mapped.insideLocations || mapped.insideLocations.length === 0) {
            this.insideLocationsChips.set([{ id: -1, name: 'Anywhere in Bangladesh' }]);
          } else {
            this.insideLocationsChips.set(mapped.insideLocations);
          }
          this.outsideLocationsChips.set(mapped.outsideLocations);
          this.organizationsChips.set(mapped.organizations);
          this.apiError = null;
        } else {
          this.apiError = 'Failed to load preferred areas.';
        }
      },
      error: (err) => {
        this.apiError = 'Failed to load preferred areas.';
      }
    });
  }

  fetchSkillCategories() {
    this.preferredAreasService.getSkillCategories(3, 'EN', '').subscribe({
      next: (res) => {
        if (res.eventType === 1) {
          const dataObj = res.eventData?.find((d) => d.key === 'Success');
          this.skillCategories = dataObj?.value?.skillCategories || [];
          this.skillCategoryApiError = null;
          this.functionalCategories = this.skillCategories.filter(cat => cat.categoryId >= 1 && cat.categoryId <= 29);
          this.specialSkilledCategories = this.skillCategories.filter(cat => (cat.categoryId >= 61 && cat.categoryId <= 92) || cat.categoryId === -11);

          // Initialize FormControls for checkboxes
          this.functionalCategories.forEach(cat => {
            this.functionalCategoryControls[cat.categoryId] = new FormControl(false, { nonNullable: true });
            this.functionalCategoryControls[cat.categoryId].valueChanges.subscribe(checked => {
              this.onFunctionalCategoryToggle(cat, checked);
            });
          });
          this.specialSkilledCategories.forEach(cat => {
            this.specialSkilledCategoryControls[cat.categoryId] = new FormControl(false, { nonNullable: true });
            this.specialSkilledCategoryControls[cat.categoryId].valueChanges.subscribe(checked => {
              this.onSpecialSkilledCategoryToggle(cat, checked);
            });
          });
        } else {
          this.skillCategoryApiError = 'Failed to load skill categories.';
        }
      },
      error: (err) => {
        this.skillCategoryApiError = 'Failed to load skill categories.';
      }
    });
  }

  closePreferredForm(){
    this.isPreferredFormOpen.set(false)
  }

  openPreferredForm() {
    // Set selected IDs for categories
    this.selectedFunctionalCategoryIds.set(this.functionalCategoriesChips().map(cat => cat.id));
    this.selectedSpecialSkilledCategoryIds.set(this.specialSkilledCategoriesChips().map(cat => cat.id));
    this.form.get('functionalCategoryIds')!.setValue(this.selectedFunctionalCategoryIds());
    this.form.get('specialSkilledCategoryIds')!.setValue(this.selectedSpecialSkilledCategoryIds());
    // Set selected IDs for locations
    this.selectedInsideLocationIds.set(this.insideLocationsChips().map(loc => loc.id.toString()));
    this.selectedOutsideLocationIds.set(this.outsideLocationsChips().map(loc => loc.id.toString()));
    // Set selected IDs for organizations
    this.selectedOrganizationIds.set(this.organizationsChips().map(org => org.id.toString()));
    // Set controls for multi-selects
    this.insideLocationControl.setValue(this.insideLocationsChips().map(loc => ({ label: loc.name, value: loc.id.toString() })));
    this.outsideLocationControl.setValue(this.outsideLocationsChips().map(loc => ({ label: loc.name, value: loc.id.toString() })));
    this.organizationControl.setValue(this.organizationsChips().map(org => ({ label: org.name, value: org.id.toString() })));
    // Set checkboxes for categories
    Object.values(this.functionalCategoryControls).forEach(ctrl => ctrl.setValue(false, { emitEvent: false }));
    Object.values(this.specialSkilledCategoryControls).forEach(ctrl => ctrl.setValue(false, { emitEvent: false }));
    this.selectedFunctionalCategoryIds().forEach(id => {
      if (this.functionalCategoryControls[id]) this.functionalCategoryControls[id].setValue(true, { emitEvent: false });
    });
    this.selectedSpecialSkilledCategoryIds().forEach(id => {
      if (this.specialSkilledCategoryControls[id]) this.specialSkilledCategoryControls[id].setValue(true, { emitEvent: false });
    });
    this.isPreferredFormOpen.set(true);
  }

  onFunctionalCategoryToggle(category: SkillCategory, checked: boolean) {
    const current = this.selectedFunctionalCategoryIds();
    let updated: number[];
    if (checked) {
      if (current.length < 3 && !current.includes(category.categoryId)) {
        updated = [...current, category.categoryId];
      } else {
        updated = current;
        // If over max, revert the checkbox
        if (!current.includes(category.categoryId)) {
          this.functionalCategoryControls[category.categoryId].setValue(false, { emitEvent: false });
        }
      }
    } else {
      updated = current.filter(id => id !== category.categoryId);
    }
    this.selectedFunctionalCategoryIds.set(updated);
    this.form.get('functionalCategoryIds')!.setValue(updated);
  }

  onSpecialSkilledCategoryToggle(category: SkillCategory, checked: boolean) {
    const current = this.selectedSpecialSkilledCategoryIds();
    let updated: number[];
    if (checked) {
      if (current.length < 3 && !current.includes(category.categoryId)) {
        updated = [...current, category.categoryId];
      } else {
        updated = current;
        if (!current.includes(category.categoryId)) {
          this.specialSkilledCategoryControls[category.categoryId].setValue(false, { emitEvent: false });
        }
      }
    } else {
      updated = current.filter(id => id !== category.categoryId);
    }
    this.selectedSpecialSkilledCategoryIds.set(updated);
    this.form.get('specialSkilledCategoryIds')!.setValue(updated);
  }

  // Generic computed for selected categories
  selectedCategories = (type: 'functional' | 'special') => computed(() => {
    if (type === 'functional') {
      return this.functionalCategories.filter(cat => this.selectedFunctionalCategoryIds().includes(cat.categoryId));
    } else {
      return this.specialSkilledCategories.filter(cat => this.selectedSpecialSkilledCategoryIds().includes(cat.categoryId));
    }
  });

  // Generic chip removal function
  removeCategoryChip(type: 'functional' | 'special', categoryId: number) {
    if (type === 'functional' && this.functionalCategoryControls[categoryId]) {
      this.functionalCategoryControls[categoryId].setValue(false);
    } else if (type === 'special' && this.specialSkilledCategoryControls[categoryId]) {
      this.specialSkilledCategoryControls[categoryId].setValue(false);
    }
  }

  // --- Auto-suggestion methods ---
  fetchInsideLocationSuggestions(query: string) {
    // Only call API if query has at least 3 non-space characters
    const trimmed = query.replace(/\s/g, '');
    if (trimmed.length < 3) {
      this.insideLocationSuggestions.set([]);
      this.insideLocationNoDataMessage.set(null);
      return;
    }
    const payload = {
      condition: '',
      banglaField: '',
      con1: '0',
      examTitle: '',
      langType: this.language,
      param: '1',
      strData: query
    };
    this.preferredAreasService.getAutoSuggestions(payload).subscribe({
      next: (res) => {
        this.insideLocationSuggestions.set(res.locations);
        // this.insideLocationNoDataMessage.set(res.noDataMessage || null);
      },
      error: () => {
        this.insideLocationSuggestions.set([]);
        this.insideLocationNoDataMessage.set('Failed to fetch suggestions.');
      }
    });
  }

  fetchOutsideLocationSuggestions(query: string) {
    // Only call API if query has at least 3 non-space characters
    const trimmed = query.replace(/\s/g, '');
    if (trimmed.length < 3) {
      this.insideLocationSuggestions.set([]);
      this.insideLocationNoDataMessage.set(null);
      return;
    }
    const payload = {
      condition: '',
      banglaField: '',
      con1: '1',
      examTitle: '',
      langType: this.language,
      param: '1',
      strData: query
    };
    this.preferredAreasService.getAutoSuggestions(payload).subscribe({
      next: (res) => {
        this.outsideLocationSuggestions.set(res.locations);
        // this.outsideLocationNoDataMessage.set(res.noDataMessage || null);
      },
      error: () => {
        this.outsideLocationSuggestions.set([]);
        this.outsideLocationNoDataMessage.set('Failed to fetch suggestions.');
      }
    });
  }

  fetchOrganizationSuggestions(query: string) {
    // Only call API if query has at least 3 non-space characters
    const trimmed = query.replace(/\s/g, '');
    if (trimmed.length < 3) {
      this.insideLocationSuggestions.set([]);
      this.insideLocationNoDataMessage.set(null);
      return;
    }
    const payload = {
      condition: '',
      banglaField: '',
      con1: '',
      examTitle: '',
      langType: this.language,
      param: '2',
      strData: query
    };
    this.preferredAreasService.getAutoSuggestions(payload).subscribe({
      next: (res) => {
        this.organizationSuggestions.set(res.organizations);
        // this.organizationNoDataMessage.set(res.noDataMessage || null);
      },
      error: () => {
        this.organizationSuggestions.set([]);
        this.organizationNoDataMessage.set('Failed to fetch suggestions.');
      }
    });
  }

  onInsideLocationSelect($event: SelectItem[]) {
    // Remove 'Anywhere in Bangladesh' if any other location is selected
    const anywhereId = '-1';
    let unique = Array.from(new Map($event.map(item => [item.value, item])).values());
    // If 'Anywhere in Bangladesh' is selected and another location is also selected, remove 'Anywhere in Bangladesh'
    if (unique.some(item => item.value === anywhereId) && unique.length > 1) {
      unique = unique.filter(item => item.value !== anywhereId);
    }
    const selected = unique.map(item => item.value);
    if (selected.length > 15) {
      this.selectedInsideLocationIds.set(selected.slice(0, 15));
      this.insideLocationControl.setValue(unique.slice(0, 15));
    } else {
      this.selectedInsideLocationIds.set(selected);
      this.insideLocationControl.setValue(unique);
    }
  }

  removeInsideLocationChip(locationID: string) {
    const updated = this.selectedInsideLocationIds().filter(id => id !== locationID);
    this.selectedInsideLocationIds.set(updated);
    // Update the control value to remove the chip from the UI
    const current = this.insideLocationControl.value || [];
    this.insideLocationControl.setValue(current.filter(item => item.value !== locationID));
  }

  onOutsideLocationSelect($event: SelectItem[]) {
    // Only allow max 10 unique selections, and prevent duplicates
    const unique = Array.from(new Map($event.map(item => [item.value, item])).values());
    const selected = unique.map(item => item.value);
    if (selected.length > 10) {
      this.selectedOutsideLocationIds.set(selected.slice(0, 10));
      this.outsideLocationControl.setValue(unique.slice(0, 10));
    } else {
      this.selectedOutsideLocationIds.set(selected);
      this.outsideLocationControl.setValue(unique);
    }
  }

  removeOutsideLocationChip(locationID: string) {
    const updated = this.selectedOutsideLocationIds().filter(id => id !== locationID);
    this.selectedOutsideLocationIds.set(updated);
    const current = this.outsideLocationControl.value || [];
    this.outsideLocationControl.setValue(current.filter(item => item.value !== locationID));
  }

  onOrganizationSelect($event: SelectItem[]) {
    const unique = Array.from(new Map($event.map(item => [item.value, item])).values());
    const selected = unique.map(item => item.value);
    if (selected.length > 12) {
      this.selectedOrganizationIds.set(selected.slice(0, 12));
      this.organizationControl.setValue(unique.slice(0, 12));
    } else {
      this.selectedOrganizationIds.set(selected);
      this.organizationControl.setValue(unique);
    }
  }

  removeOrganizationChip(orgTypeID: string) {
    const updated = this.selectedOrganizationIds().filter(id => id !== orgTypeID);
    this.selectedOrganizationIds.set(updated);
    const current = this.organizationControl.value || [];
    this.organizationControl.setValue(current.filter(item => item.value !== orgTypeID));
  }

  // Helper to map LocationResponse[] to SelectItem[] for app-multi-select
  get insideLocationSelectItems(): SelectItem[] {
    return this.insideLocationSuggestions().map(loc => ({
      label: loc.locationName,
      value: loc.locationID
    }));
  }

  get outsideLocationSelectItems(): SelectItem[] {
    return this.outsideLocationSuggestions().map(loc => ({
      label: loc.locationName,
      value: loc.locationID
    }));
  }

  // --- Organization autosuggestion ---
  get organizationSelectItems(): SelectItem[] {
    return this.organizationSuggestions().map(org => ({
      label: org.orG_TYPE_NAME,
      value: org.orG_TYPE_ID
    }));
  }

  // --- Validation state ---
  showValidationErrors = signal(false);
  get isCategorySelected() {
    return (
      this.selectedFunctionalCategoryIds().length > 0 ||
      this.selectedSpecialSkilledCategoryIds().length > 0
    );
  }
  get showCategoryValidationError() {
    return this.showValidationErrors() && !this.isCategorySelected;
  }

  get isInsideLocationSelected() {
    return this.selectedInsideLocationIds().length > 0;
  }
  get showInsideLocationValidationError() {
    return this.showValidationErrors() && !this.isInsideLocationSelected;
  }

  // --- Submit handler ---
  onSubmit() {
    this.showValidationErrors.set(true);
    if (!this.isCategorySelected || !this.isInsideLocationSelected) {
      // Validation failed, do not proceed
      return;
    }

    // Prepare request body for API
    const payload = {
      userGuid: this.userGuidId!,
      whiteCategories: this.selectedFunctionalCategoryIds(),
      totalWhiteCategories: this.selectedFunctionalCategoryIds().length,
      blueCategories: this.selectedSpecialSkilledCategoryIds(),
      totalBlueCategories: this.selectedSpecialSkilledCategoryIds().length,
      districts: this.selectedInsideLocationIds().map(id => parseInt(id)).filter(id => !isNaN(id)),
      totalDistricts: this.selectedInsideLocationIds().length,
      countries: this.selectedOutsideLocationIds().map(id => parseInt(id)).filter(id => !isNaN(id)),
      totalCountries: this.selectedOutsideLocationIds().length,
      organizations: this.selectedOrganizationIds().map(id => parseInt(id)).filter(id => !isNaN(id)),
      totalOrganizations: this.selectedOrganizationIds().length
    };


    this.preferredAreasService.updatePreferredAreas(payload).subscribe({
      next: () => {
        alert('Preferred areas updated successfully.');
        this.showValidationErrors.set(false);
        this.isPreferredFormOpen.set(false);
        this.fetchPreferredAreas();
      },
      error: (err) => {
        alert('Failed to update preferred areas. Please try again.');
      }
    });
  }
}
