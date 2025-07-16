import { GlobalConfig } from "ngx-toastr";

export const ToastrConfig: Partial<GlobalConfig> = {
    iconClasses: {
        error: 'err-msg',
        info: 'info-msg',
        success: 'success-msg',
        warning: 'warning-msg'
    },
    closeButton: true
}

export const ModalAttributes = {
    "aria-haspopup": "dialog",
    "aria-expanded": false,
    "aria-controls": "hs-vertically-centered-scrollable-modal",
    "data-hs-overlay": "#hs-vertically-centered-scrollable-modal",
    "id": "hs-large-modal"
}