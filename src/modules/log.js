import Setting from "../setting";

function getConsistentColorFrom3Chars(text) {
    // รับเฉพาะ 3 ตัวอักษรแรก
    text = text.slice(0, 4).padEnd(4, "0"); // ถ้าน้อยกว่า 3 ตัวให้เติม "0"

    // ใช้ hash function เพื่อให้สีที่ได้คงที่
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash); // ฟังก์ชันแฮช
    }

    // แปลง hash เป็นค่า RGB โดยให้ค่ามีความหลากหลาย
    let r = (hash >> 16) & 0xff; // ค่าแดง
    let g = (hash >> 8) & 0xff;  // ค่าสีเขียว
    let b = hash & 0xff;         // ค่าสีน้ำเงิน

    // เพิ่มการสุ่มเพื่อให้มีความหลากหลายมากขึ้น แต่ยังคงให้สีเดิมถ้าใช้ข้อความเดิม
    r = (r + Math.floor(Math.random() * 50)) % 256;
    g = (g + Math.floor(Math.random() * 50)) % 256;
    b = (b + Math.floor(Math.random() * 50)) % 256;

    // แปลงเป็น HEX
    const color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    return color;
}

function Log( index, message ) {
    if(Setting.debug || process.env.NODE_ENV === 'development'){

        const color = getConsistentColorFrom3Chars(index);
        if (message === undefined) {
            if (index.charAt(0) === index.charAt(0).toUpperCase())
                index = `#### ${index} ####`;
            console.log(`%c${index}`, `color:${color};`);
        } else {
            console.log(`%c#${index} ${message}`, `color:${color};`);
        }
    }
}

export default Log;
