import axios from 'axios';
import { load } from 'cheerio';

function isValidEmail(email: string): boolean {
    return !!email
        .toString()
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

async function getUserByRollNo(studentId: string): Promise<string> {
    var options = {
        method: 'POST',
        url: 'https://charusat.edu.in:912/FeesPaymentApp/frmFeesPayment.aspx',
        headers: {
            // cookie: 'ASP.NET_SessionId=534r4v55bonfr2uc45vfus45',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        data: {
            __VIEWSTATE: '/wEPDwUKMTYwNDQ4ODc1MQ8WAh4MUHJldmlvdXNQYWdlBT5odHRwczovL2NoYXJ1c2F0LmVkdS5pbjo5MTIvRmVlc1BheW1lbnRBcHAvZnJtRmVlc1BheW1lbnQuYXNweBYCAgMPZBYCAgMPZBYCZg9kFgICAQ9kFgRmD2QWBAIBDw8WAh4HVmlzaWJsZWdkZAIXD2QWCgIBDw8WAh4EVGV4dGVkZAIDDw8WAh8CZWRkAgUPDxYCHwJlZGQCDQ8QZGQWAGQCDw9kFhoCAQ8WAh4FVmFsdWVlZAIDDxYCHwNlZAIFDxYCHwNlZAIHDxYCHwNlZAIJDzwrAA0BAA8WBB4LXyFEYXRhQm91bmRnHgtfIUl0ZW1Db3VudGZkZAILDzwrAAkBAA8WBB4IRGF0YUtleXMWAB8FAv////8PZGQCDQ8WAh4JaW5uZXJodG1sBQ9GZWVzIHRvIGJlIFBhaWRkAg8PDxYEHwJlHwFoZGQCEQ9kFgICAQ8PFgQfAmUfAWhkZAITD2QWAgIBDw8WAh8CZWRkAhUPDxYCHwFoZGQCFw8QDxYCHwFoZGQWAGQCGQ8PFgIfAWhkZAIBD2QWEgIHDw8WAh8CZWRkAgkPDxYCHwJlZGQCDQ8PFgIfAmVkZAIRD2QWAgIBDw8WAh8CZWRkAhMPDxYCHwJlZGQCFQ8PFgIfAmVkZAIXDw8WAh8CZWRkAhkPDxYCHwJlZGQCGw9kFgICAQ8PFgIfAmVkZBgCBQZtdlBhZ2UPD2RmZAUMZ3ZQZW5kaW5nZmVlDzwrAAoBCGZksLNTv8oXnEvqMbz5XPh3IsqW/B0=',
            txtStudentID: studentId,
            btnSearch: 'Search'
        }
    };

    const response = await axios.request(options)
    const $ = load(response.data);
    const studentName = $('#lblStudentName').text();
    if(studentName === "") return generateName();
    let fName = studentName.split(" ")[1].toLowerCase();
    fName = fName.charAt(0).toUpperCase() + fName.slice(1);
    let lName = studentName.split(" ")[0].toLowerCase();
    lName = lName.charAt(0).toUpperCase() + lName.slice(1);
    return fName + " " + lName;
}

function generatePassword(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function generateName(): string {
    const adjectives = ['Brilliant', 'Spirited', 'Vibrant', 'Genuine', 'Harmonious'];
    const nouns = ['Phoenix', 'Cascade', 'Horizon', 'Zenith', 'Whisper'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return randomAdjective + randomNoun;
}


export { isValidEmail, getUserByRollNo, generateName, generatePassword };