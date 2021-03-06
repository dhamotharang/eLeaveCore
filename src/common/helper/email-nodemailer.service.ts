/**
 * Declare nodemailer
 */
var nodemailer = require('nodemailer');
/**
 * Declare smtpTransport
 */
var smtpTransport = require('nodemailer-smtp-transport');
/**
 * Declare handlebars
 */
var handlebars = require('handlebars');
/**
 * Declare fs
 */
var fs = require('fs');

/**
 * Service for email nodemailer
 *
 * @export
 * @class EmailNodemailerService
 */
export class EmailNodemailerService {

    /**
     * Method process mail
     *
     * @param {string} email
     * @param {string} token
     * @returns
     * @memberof EmailNodemailerService
     */
    public mailProcess([adminName, emailAdmin, emailUser, codeUrl]: [string, string, string, string]) {
        smtpTransport = this.createSMTP();

        var replacements = {
            admin_name: adminName,
            email: emailUser,
            code: codeUrl,
            product_name: 'beeSuite',
            url_image: "https://www.beesuite.app/wp-content/uploads/2020/07/bee04.png",
            email_admin: emailAdmin,
            url_app: "a.beesuite.app",
            support_url: "https://www.beesuite.app/contact-us/",
        };
        var from = process.env.SMTPSENDER;//'wantan.wonderland.2018@gmail.com';
        var emailTosend = emailUser;
        var subject = replacements.product_name + ' User Invitation';

        let data = {};
        data['replacement'] = replacements;
        data['from'] = from;
        data['emailTosend'] = emailTosend;
        data['subject'] = subject;

        let dataRes = this.readHTMLFile('src/common/email-templates/userinvitation.html', this.callbackReadHTML(data));

        const fs = require('fs');

        // append data to a file
        fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(data), (err) => {
            if (err) {
                throw err;
            }
        });

        return "success";
    }

    /**
     * mail process for apply leave
     *
     * @param {string} email
     * @param {string} name
     * @returns
     * @memberof EmailNodemailerService
     */
    public mailProcessApply([email, name, startDate, endDate, message, leaveType, reasonLeave]: [string, string, Date, Date, string, string, string]) {
        smtpTransport = this.createSMTP();
        // let leaveType = 'Annual leave';
        // let reasonLeave = 'Travel';
        // name = name + ` (Staff ID : 3107)`;
        // message = `Start Date: 2020-10-15 </br>
        // End Date: 2020-10-16</br>
        // Duration: Full Day</br>
        // </br>
        // Start Date: 2020-10-17</br>
        // End Date: 2020-10-17</br>
        // Duration: Half Day - AM`;

        var replacements = {
            email: email,
            user_name: name, // need to add with staff id e.g: Ang Ruo Li (Staff ID: 3107)
            url_image: "https://www.beesuite.app/wp-content/uploads/2020/07/bee04.png",
            url_app: "https://a.beesuite.app/#/main/task/", // "https://a.beesuite.app/", // Add link with focus page on task
            message: message, // message detail start, end, and duration
            leave_type: leaveType,
            reason: reasonLeave
        };
        var from = process.env.SMTPSENDER;//'wantan.wonderland.2018@gmail.com';
        var emailTosend = email;
        var subject = 'beeSuite Leave applied';

        let data = {};
        data['replacement'] = replacements;
        data['from'] = from;
        data['emailTosend'] = emailTosend;
        data['subject'] = subject;

        let dataRes = this.readHTMLFile('src/common/email-templates/notifyapplyleave.html', this.callbackReadHTML(data));

        const fs = require('fs');

        // append data to a file
        fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(data), (err) => {
            if (err) {
                throw err;
            }
        });

        return "success";
    }

    /**
     * mail process for apply leave
     *
     * @param {string} email
     * @param {string} name
     * @returns
     * @memberof EmailNodemailerService
     */
    public mailProcessAppproveStatus([email, approverName, leaveStatus, message, contentCal, userName, leaveType, reason, remark]: [string, string, string, string, string, string, string, string, string]) {

        smtpTransport = this.createSMTP();

        var replacements = {
            email: email,
            url_image: "https://www.beesuite.app/wp-content/uploads/2020/07/bee04.png",
            url_app: "https://a.beesuite.app/",
            message: message,
            approver_name: approverName,
            leave_status: leaveStatus,
            user_name: userName,
            leave_type: leaveType,
            reason: reason,
            remark: remark

        };
        var from = process.env.SMTPSENDER;//'wantan.wonderland.2018@gmail.com';
        var emailTosend = email; // 'fakhri@zen.com.my';// email;
        var subject = 'beeSuite Leave ' + leaveStatus;
        var icalEvent = {
            filename: "leavestatus.ics",
            method: 'publish',
            content: contentCal
        }

        let data = {};
        data['replacement'] = replacements;
        data['from'] = from;
        data['emailTosend'] = emailTosend;
        data['subject'] = subject;
        data['icalEvent'] = icalEvent;

        let dataRes = this.readHTMLFile('src/common/email-templates/notifyleavestatus.html', this.callbackReadHTMLWithCalendar(data));

        const fs = require('fs');

        // append data to a file
        fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(data), (err) => {
            if (err) {
                throw err;
            }
        });

        return "success";
    }

    public mailProcessCancelStatus([email, approverName, leaveStatus, message, leaveType, reasonLeave, name, staffId, remarks]: [string, string, string, string, string, string, string, string, string]) {
        smtpTransport = this.createSMTP();

        var replacements = {
            email: email,
            user_name: name, // need to add with staff id e.g: Ang Ruo Li (Staff ID: 3107)
            url_image: "https://www.beesuite.app/wp-content/uploads/2020/07/bee04.png",
            url_app: "https://a.beesuite.app/#/main/task/", // "https://a.beesuite.app/", // Add link with focus page on task
            message: message, // message detail start, end, and duration
            leave_type: leaveType,
            reason: reasonLeave,
            approver_name: approverName,
            leave_status: leaveStatus,
            remark: remarks
        };

        // var replacements = {
        //     email: email,
        //     url_image: "https://www.beesuite.app/wp-content/uploads/2020/07/bee04.png",
        //     url_app: "https://a.beesuite.app/",
        //     message: message,
        //     approver_name: approverName,
        //     leave_status: leaveStatus
        // };
        var from = process.env.SMTPSENDER;//'wantan.wonderland.2018@gmail.com';
        var emailTosend = email;// 'fakhri@zen.com.my';// email;
        var subject = 'beeSuite Leave ' + leaveStatus;

        let data = {};
        data['replacement'] = replacements;
        data['from'] = from;
        data['emailTosend'] = emailTosend;
        data['subject'] = subject;

        let dataRes = this.readHTMLFile('src/common/email-templates/notifyleavestatus.html', this.callbackReadHTML(data));

        const fs = require('fs');

        // append data to a file
        fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(data), (err) => {
            if (err) {
                throw err;
            }
        });

        return "success";
    }

    /**
     * mail process for approval leave
     *
     * @param {string} email
     * @param {string} name
     * @returns
     * @memberof EmailNodemailerService
     */
    public mailProcessApprove([email, name, leavetype, message]: [string, string, string, string]) {
        smtpTransport = this.createSMTP();

        var replacements = {
            // email: email,
            // code: "#" + name,
            // name: name,
            leavetype: leavetype,
            applier_name: name,
            message: message,//' on 2020-10-10 to 2020-10-11',
            url_image: "https://www.beesuite.app/wp-content/uploads/2020/07/bee04.png",
            url_app: "https://a.beesuite.app/",
        };
        var from = process.env.SMTPSENDER;//'wantan.wonderland.2018@gmail.com';
        var emailTosend = email;
        var subject = replacements.applier_name + ' is on Leave ???';

        let data = {};
        data['replacement'] = replacements;
        data['from'] = from;
        data['emailTosend'] = emailTosend;
        data['subject'] = subject;

        let dataRes = this.readHTMLFile('src/common/email-templates/notifyleaveapprove.html', this.callbackReadHTML(data));

        const fs = require('fs');

        // append data to a file
        fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(data), (err) => {
            if (err) {
                throw err;
            }
        });

        return "success";
    }

    /**
     * Mail process forgot password
     *
     * @param {string} email
     * @returns
     * @memberof EmailNodemailerService
     */
    public mailProcessForgotPassword(email: string) {
        smtpTransport = this.createSMTP();

        var replacements = {
            email: email,
            code: "whereami." + email,
            name: email
        };
        var from = process.env.SMTPSENDER;//'wantan.wonderland.2018@gmail.com';
        var emailTosend = email;
        var subject = 'Forgot password eLeave';

        let data = {};
        data['replacement'] = replacements;
        data['from'] = from;
        data['emailTosend'] = emailTosend;
        data['subject'] = subject;

        let dataRes = this.readHTMLFile('src/common/email-templates/forgotpassword.html', this.callbackReadHTML(data));

        const fs = require('fs');

        // append data to a file
        fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(data), (err) => {
            if (err) {
                throw err;
            }
        });

        return { "status": "email send" };
    }

    /**
     * Setup and send email
     *
     * @memberof EmailNodemailerService
     */
    public callbackReadHTML = (data) => async function (err, html) {

        var template = handlebars.compile(html);
        // var replacements = {
        //     email: email,
        //     code: "#" + name,
        //     name: name
        // };
        var htmlToSend = template(data.replacement);
        var mailOptions = {
            from: data.from, // 'wantan.wonderland.2018@gmail.com',
            to: data.emailTosend, // email,
            subject: data.subject, // 'Leave approval ???',
            html: htmlToSend
        };

        return await smtpTransport.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
                return await error;
            } else {
                console.log(info);
                const fs = require('fs');
                fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(info), (err) => {
                    if (err) {
                        throw err;
                    }
                });
                return await info;
            }
        });
    }

    public callbackReadHTMLWithCalendar = (data) => async function (err, html) {

        var template = handlebars.compile(html);
        // var replacements = {
        //     email: email,
        //     code: "#" + name,
        //     name: name
        // };
        var htmlToSend = template(data.replacement);
        var mailOptions = {
            from: data.from, // 'wantan.wonderland.2018@gmail.com',
            to: data.emailTosend, // email,
            subject: data.subject, // 'Leave approval ???',
            html: htmlToSend,
            icalEvent: data.icalEvent
        };

        return await smtpTransport.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
                return await error;
            } else {
                console.log(info);
                const fs = require('fs');
                fs.appendFile('sendMail.log', '\n[' + new Date() + ']' + JSON.stringify(info), (err) => {
                    if (err) {
                        throw err;
                    }
                });
                return await info;
            }
        });
    }

    /**
     * Method read html file
     *
     * @memberof EmailNodemailerService
     */
    public readHTMLFile = function (path, callback) {
        return fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    /**
     * Setup smtp data
     *
     * @returns
     * @memberof EmailNodemailerService
     */
    public createSMTP() {
        smtpTransport = nodemailer.createTransport({
            host: process.env.SMTPHOST || "smtp.ethereal.email",
            port: parseInt(process.env.SMTPPORT) || 587,
            secure: JSON.parse(process.env.SMTPSECURE) || false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTPUSER || 'casimir.mcglynn@ethereal.email',
                pass: process.env.SMTPPASSWORD || 'GYSA4r14EQRPB9guAK'
            }
        });
        return smtpTransport;
    }
}