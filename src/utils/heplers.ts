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
    const response = await axios.get(`${process.env.SERVER2_URL}/${studentId}`)
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