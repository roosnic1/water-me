import {useFirestore, useFirestoreDocData} from "reactfire";
import React, {useState} from "react";
import Webcam from "react-webcam";
import Select from 'react-select'


export default function CreatePlant() {
    //const plantsRef = useFirestore().collection('plants')

    const [images, setImages] = useState<string[]>([])
    const [plants, setPlants] = useState<any[]>([])

    const webcamRef = React.useRef(null)

    const capture = React.useCallback(
        () => {
            if(webcamRef !== null && webcamRef.current !== null) {
                // @ts-ignore
                const imageSrc = webcamRef.current.getScreenshot();
                setImages([...images, imageSrc])
            }
        },
        [webcamRef, images]
    )

    const deleteImage = React.useCallback(
        (id) => {
            setImages(images.filter(image => image !== id))
        },
        [images]
    )

    const handleUpload = (event: any) => {
        if(event.target.files) {
            console.log('event', event.target.files)
            const promises = [...event.target.files].map((file: any) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                        if(readerEvent.target) {
                            const res = readerEvent.target.result;
                            console.log(res);
                            resolve(res);
                        } else {
                            reject()
                        }
                    }
                    reader.readAsDataURL(file)
                })
            })

            Promise.all(promises).then(base64Images => {
                // @ts-ignore
                setImages([...images, ...base64Images])
                event.target.value = ''
            })
        }
    };

    const getPlantFromPictures = React.useCallback(
         () => {
            const body = {
                api_key: process.env.REACT_APP_PLANT_ID_API_KEY,
                images: images,
                modifiers: ["crops_fast", "similar_images"],
                plant_language: "en",
                plant_details: ["common_names",
                    "url",
                    "name_authority",
                    "wiki_description",
                    "taxonomy",
                    "synonyms"]
            }
            fetch('https://api.plant.id/v2/identify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(response => response.json())
            .then((data) => {
                if(data.suggestions) {
                    setPlants(data.suggestions)
                }
                console.log('data', data)
            }).catch(error => {
                console.warn('error while calling plant.id', error)
            })
        },
        [images]
    )

    return (
        <>
            <h1>Identify Plant</h1>
            <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={{
                    facingMode: 'environment'
                }}
            />
            <div className="grid grid-cols-2 gap-4">
                <button onClick={capture}>Take picture</button>
                <input type="file" name="file" multiple onChange={handleUpload} />
            </div>
            <div className="grid grid-cols-4 gap-4">
                { images.map((image, key) => <div key={key}><img src={image} /><button onClick={deleteImage.bind(null, image)}>delete</button></div>)}
            </div>
            <button onClick={getPlantFromPictures}>Analyze Pictures</button>
            { plants.length > 0 &&
                <Select options={plants.map(plant => ({value: plant, label: `${plant.plant_name} - Probability: ${plant.probability}`}))} />
            }
        </>
    )
}
