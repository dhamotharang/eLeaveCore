import { EmailResultDTO } from "src/api/invitation/dto/email-result.dto";
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
import { SentMessageInfo, SendMailOptions } from 'nodemailer';

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
    public mailProcess(email: string, token: string) {
        console.log('is this run in nodemoduleservice?');

        smtpTransport = nodemailer.createTransport({
            host: process.env.SMTPHOST || "smtp.ethereal.email",
            port: process.env.SMTPPORT || 587,
            secure: process.env.SMTPSECURE || false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTPUSER || 'casimir.mcglynn@ethereal.email',
                pass: process.env.SMTPPASSWORD || 'GYSA4r14EQRPB9guAK'
            }
        });

        let dataRes = this.readHTMLFile('src/common/email-templates/userinvitation.html', function (err, html) {

            var template = handlebars.compile(html);
            var replacements = {
                email: email,
                code: "http://zencore.zen.com.my:3000/api/invitation/" + token
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'wantan.wonderland.2018@gmail.com',
                to: email,
                subject: 'Testing Invitation System ✔',
                html: htmlToSend
            };

            smtpTransport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return error;
                } else {
                    // console.log('This message was send');
                    console.log(info);
                    // let data = new EmailResultDTO;
                    // data.accepted = info.accepted[0];
                    // data.rejected = info.rejected[0];
                    // data.envelopeTime = info.envelopeTime;
                    // data.messageTime = info.messageTime;
                    // data.messageSize = info.messageSize;
                    // data.response = info.response;
                    // data.emailfrom = info.envelope.from;
                    // data.emailto = info.envelope.to;
                    // data.messageId = info.messageId;
                    // console.log(data);
                    // return data;
                    return info;
                }
            });

        });
        // let dataRes = {};
        // dataRes['email'] = email;
        // dataRes['status'] = 'send';
        // return dataRes;
        // setTimeout(function(){
        // console.log('dah return ke?');
        // return dataRes;
        // },10000);
        return "success";
    }


    public mailProcessApprove(email: string, name: string) {
        console.log('is this run in nodemoduleservice?');

        smtpTransport = nodemailer.createTransport({
            host: process.env.SMTPHOST || "smtp.ethereal.email",
            port: process.env.SMTPPORT || 587,
            secure: process.env.SMTPSECURE || false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTPUSER || 'casimir.mcglynn@ethereal.email',
                pass: process.env.SMTPPASSWORD || 'GYSA4r14EQRPB9guAK'
            }
        });

        let dataRes = this.readHTMLFile('src/common/email-templates/notifyleaveapprove.html', function (err, html) {

            var template = handlebars.compile(html);
            var replacements = {
                email: email,
                code: "#" + name,
                name: name
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'wantan.wonderland.2018@gmail.com',
                to: email,
                subject: 'Leave approval ✔',
                html: htmlToSend
            };
            smtpTransport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return error;
                } else {
                    console.log(info);
                    return info;
                }
            });
        });
        return "success";
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

    // public processEmailsFunctions(mailOptions) {
    //     smtpTransport.sendMail(mailOptions, function (error, info) {
    //         if (error) {
    //             console.log(error);
    //             return error;
    //         } else {
    //             // console.log('This message was send');
    //             console.log(info);
    //             // let data = new EmailResultDTO;
    //             // data.accepted = info.accepted[0];
    //             // data.rejected = info.rejected[0];
    //             // data.envelopeTime = info.envelopeTime;
    //             // data.messageTime = info.messageTime;
    //             // data.messageSize = info.messageSize;
    //             // data.response = info.response;
    //             // data.emailfrom = info.envelope.from;
    //             // data.emailto = info.envelope.to;
    //             // data.messageId = info.messageId;
    //             // // console.log(data);
    //             // return data;
    //             return info;
    //         }
    //     });
    // }
}