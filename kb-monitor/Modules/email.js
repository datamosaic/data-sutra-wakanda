﻿//==============================================================================// email sendingvar myEmailConfig = {    user: "wakserveremail@gmail.com",    password: "lrdbBJAhdCWsL}ExW31)",    address: "smtp.gmail.com",    domain: "gmail.com",    port: 465,    isSSL: true};exports.send = function send(msg){	var mail = require("waf-mail/mail");	var message = new mail.Mail();	//message.addField("X-Mailer", "strato.Sphere 1.0"); 	message.from = myEmailConfig.user;	message.to = msg.to;	message.subject = msg.subject;	message.setContent(msg.body);		var result = sendViaSMTP( myEmailConfig, message );		if( result.isSent === false )		console.log( "EMAIL.send failed: [error name] " + result.errName + " [error info] " + result.errInfo );	return result.isSent;};// from http://forum.wakanda.org/showthread.php?6295-Sending-email-through-GoDaddy// allegedly incorporated into Wak 10/11// this is local to this file, not available where this file is require()dfunction sendViaSMTP(config,message){    "use strict";      var smtp = require("waf-mail/SMTP"),  // file is actually uppercase        client,        errName,        errInfo,        isSent;     //init error tracking    errName = "";    errInfo = [];     //connect    client = new smtp.SMTP();    client.connect(config.address, config.port, config.isSSL, config.domain, function onAfterConnect(isConnected, replyArr, isESMTP) {        if (isConnected) {             //authenticate            client.authenticate(config.user, config.password, function onAfterAuthenticate(isAuthenticated, replyArr) {                if (isAuthenticated) {                     //send                    client.send(message.from, message.to, message, function onAfterSend(isSent, replyArr) {                        if (isSent) {                            exitWait();                        } else {                            errName = "smtp_SendFailed";                            errInfo = replyArr;                            exitWait();                        }                    });                } else {                    errName = "smtp_AuthFailed";                    errInfo = replyArr;                    exitWait();                }            });        } else {            errName = "smtp_CouldNotConnect";            errInfo = replyArr;            exitWait();        }    });    wait();     //determine if sent    if (errName === "") {        isSent = true;    } else {        isSent = false;    }     //return if sent and any error info    return {        isSent: isSent,        errName: errName,        errInfo: errInfo    };}