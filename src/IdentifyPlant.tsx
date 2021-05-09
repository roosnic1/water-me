import React, {useState} from "react";
import Webcam from "react-webcam";

import {Title, Button, Card, Image, ActionIcon, Modal, LoadingOverlay, Text} from "@mantine/core";


export default function IdentifyPlant() {
  const [images, setImages] = useState<string[]>([])
  const [plants, setPlants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const webcamRef = React.useRef(null)

  const capture = React.useCallback(
    () => {
      if (webcamRef !== null && webcamRef.current !== null) {
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
    if (event.target.files) {
      console.log('event', event.target.files)
      const promises = [...event.target.files].map((file: any) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (readerEvent) => {
            if (readerEvent.target) {
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
      setIsLoading(true)
      const body = {
        api_key: process.env.REACT_APP_PLANT_ID_API_KEY,
        images: images,
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: ["common_names",
          "url",
          "name_authority",
          "wiki_description",
          "wiki_image",
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
          if (data.suggestions) {
            setPlants(data.suggestions)
          }
          console.log('data', data)
        }).catch(error => {
        console.warn('error while calling plant.id', error)
      }).finally(() => {
        setIsLoading(false)
      })
    },
    [images]
  )

  const createNewPlantEntry =  React.useCallback(
    (plant) => {
     console.log('plant', plant)
    }, []
  )

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <Title order={2}>Identify Plant</Title>
      <Card shadow="sm">
        <Webcam
          audio={false}
          ref={webcamRef}
          videoConstraints={{
            facingMode: 'environment'
          }}
        />
        <Button size='xl' onClick={capture} fullWidth style={{marginTop: 10}}>Take picture</Button>
        <label htmlFor="file-upload" className="custom-file-upload" style={{cursor: 'pointer'}}>
          or upload pictures.
        </label>
        <input id="file-upload" style={{display: 'none'}} type="file" name="file" multiple onChange={handleUpload}/>
      </Card>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} shadow="sm">
            <Image
              height={80}
              fit="contain"
              src={image}
            />
            <ActionIcon onClick={deleteImage.bind(null, image)} variant="filled" color="red">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                  fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
            </ActionIcon>
          </Card>
        ))}
      </div>
      {images.length > 0 &&
      <Button size='xl' onClick={getPlantFromPictures} fullWidth style={{marginTop: 10}}>Analyze Pictures</Button>
      }

      <Modal
        opened={plants.length > 0}
        onClose={() => setPlants([])}
        title="Choose Plant "
      >
        <div className="grid grid-cols-2 gap-4">
          {plants.map((plant, index) => {
            return (
            <Card key={index} shadow="sm" onClick={createNewPlantEntry.bind(null, {name: plant.plant_name, wikiUrl: plant.plant_details.url})} style={{backgroundColor: 'white'}}>
              <Image
                width={200}
                height={80}
                fit="contain"
                src={plant.plant_details.wiki_image ? plant.plant_details.wiki_image.value : ''}
              />
              <Text weight={300} size='xs'>
                {plant.plant_name} - {(parseFloat(plant.probability) * 100).toFixed(2)}%
              </Text>
            </Card>
          )})}
        </div>
      </Modal>
    </>
  )
}
