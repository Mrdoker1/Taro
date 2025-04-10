export declare class MailService {
    private transporter;
    constructor();
    private initializeTransporter;
    private createTransporter;
    private createMailOptions;
    sendConfirmationEmail(userEmail: string, userId: string): Promise<void>;
}
