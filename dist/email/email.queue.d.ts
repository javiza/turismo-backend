export declare const EMAIL_QUEUE = "email";
export interface EmailJobData {
    to: string;
    subject: string;
    html: string;
}
