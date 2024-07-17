const words = [
    { id: 1, word: "แมว", image: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg" },
    { id: 2, word: "หมา", image: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_square.jpg" },
    // เพิ่มคำและรูปภาพตามต้องการ
]

export function GET() {
    return Response.json({
        words
    });
}