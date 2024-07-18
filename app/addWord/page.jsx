import 'bootstrap/dist/css/bootstrap.css'
import {initialWords} from "@/app/datasets/words";

export default function AddWord() {
    const res = initialWords();
    console.log(initialWords);
    return (
        <>
            <div className={'container mt-5'}>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <div className={'text-center'}>
                            <img src="https://www.wordgames.com/images/logo.png" alt="logo" width={300}/>
                            <h1>เพิ่มคำ</h1>
                        </div>
                    </div>
                    <div className={'col-12'}>
                        <div className={'form-group mb-3'}>
                            <label htmlFor="">คำ</label>
                            <input type="text" className={'form-control'} placeholder={'ตัวอย่าง : เสือ สิงค์ กระทิง แรด'}/>
                        </div>
                        <div className={'form-group mb-3'}>
                            <label htmlFor="">พาร์ทรูปภาพ</label>
                            <input type="text" placeholder={'ตัวอย่าง https://khaokheow.zoothailand.org/zoo_office/fileupload/encyclopedia_file/2.JPG'} className={'form-control'}/>
                        </div>

                        <div className={'w-100'}>
                            <button className={'btn btn-primary w-100'}>เพิ่มคำ</button>
                        </div>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <table>
                            <thead>
                            <tr>
                                <td>word</td>
                                <td>path picture</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                res.map((word, index) => (
                                    <tr key={index}>
                                        <td>{word.word}</td>
                                        <td>{word.image}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}