import { HttpParams } from '@angular/common/http';

/**
 * Query parameters for Delete Resume API.
 */
export interface DeleteResumeQuery {
    /**
     * Unique user identifier.
     * @type {string}
     */
    UserGuid: string;
    /**
     * Username.
     * @type {string}
     */
    UserName: string;
    /**
     * Password for authentication.
     * @type {string}
     */
    Password?: string;
    /**
     * Reason for deleting resume.
     * @type {string}
     */
    Reason?: string;
    /**
     * Indicates whether deletion is triggered from social media.
     * @type {number}
     */
    IsSocialMedia?: number;
    /**
     * Social media identifier.
     * @type {string}
     */
    SocialMediaId?: string;
    /**
     * Social media database table.
     * @type {string}
     */
    SMDBtable?: string;
    /**
     * Social media type.
     * @type {string}
     */
    SocialMediaType?: string;
    /**
     * One Time Password code.
     * @type {string}
     */
    OTPCode?: string;
}

/**
 * Helper to convert DeleteResumeQuery to HttpParams.
 * Only defined (non-null/undefined) fields are added.
 * Serializes IsSocialMedia to a string if provided.
 * @param input DeleteResumeQuery object.
 */
export function toHttpParams(input: DeleteResumeQuery): HttpParams {
    let params = new HttpParams();
    Object.keys(input).forEach(key => {
        const value = (input as any)[key];
        if (value !== null && value !== undefined && value !== '') {
            params = params.append(key, key === 'IsSocialMedia' ? value.toString() : value);
        }
    });
    return params;
}
