import { SubTabParamIds } from "../../common/edit-resume-tabs.const"


export const ProfileSelection = [
  {
    id: "1",
    title: 'dashboard.personalDetails',
    isCompleted: true,
    url: '/edit-profile',
    queryParams: {
      tab: 'pi',
      from: SubTabParamIds.subPersonalDetails
    }
  },

  {
    id: "2",
    title: 'dashboard.professionalQualification',
    isCompleted: false,
    url: '/edit-profile',
    queryParams: {
      tab: 'ed',
      from: SubTabParamIds.subCertificationSummary
    }
  },

  {
    id: "3",
    title: 'dashboard.academicQualification',
    isCompleted: true,
    url: '/edit-profile',
    queryParams: {
      tab: 'ed',
      from: SubTabParamIds.subAcademicSummary
    }
  },

  {
    id: "4",
    title: 'dashboard.experience',
    isCompleted: false,
    url: '/edit-profile',
    queryParams: {
      tab: 'em',
      from: SubTabParamIds.subEmpHistory
    }
  },

  {
    id: "5",
    title: 'dashboard.reference',
    isCompleted: true,
    url: '/edit-profile',
    queryParams: {
      tab: 'oi',
      from: SubTabParamIds.subReferences
    }
  },

  {
    id: "6",
    title: 'dashboard.training',
    isCompleted: true,
    url: '/edit-profile',
    queryParams: {
      tab: 'ed',
      from: SubTabParamIds.subTrainingSummary
    }
  },

  {
    id: "7",
    title: 'dashboard.specialization',
    isCompleted: true,
    url: '/edit-profile',
    queryParams: {
      tab: 'oi',
      from: SubTabParamIds.subSkill
    }
  },

  {
    id: "8",
    title: 'dashboard.photograph',
    isCompleted: true,
    url: '/edit-profile',
    queryParams: {
      tab: 'pi',
      from: SubTabParamIds.subPersonalDetails
    }
  },
]
