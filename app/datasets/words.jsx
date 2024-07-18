import axios from "axios";

export const initialWordss = [
    { word: "แมว", image: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" },
    { word: "หมา", image: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg" },
    { word: "ไก่", image: "https://image.makewebeasy.net/makeweb/m_1920x0/Q1cSYUQ7X/ContentChicken/Chicken_History.jpg?v=202012190947" },
    { word: "ยีราฟ", image: "https://khaokheow.zoothailand.org/zoo_office/fileupload/encyclopedia_file/2.JPG" },
    // เพิ่มคำและรูปภาพตามต้องการ
];


export const initialWords = () => {
    // const words = await fetch(`${process.env.API_URL}/api`)
    axios.get(`${process.env.API_URL}/api`)
        .then(({data,status}) => {
            console.log(data,status);
            return data;
        }).catch(error => {
            console.log(error)
            return [];
    })
    return [];
    // if (words.ok){
    //     console.log('words loaded',words)
    //     return words.json();
    // }else{
    //     console.log('error words')
    // }

}
