import {useFirestore, useFirestoreDocData} from "reactfire";
import React from "react";


export default function CreatePlant() {
    const plantsRef = useFirestore().collection('plants')


    // @ts-ignore
    return (
        <>
            <h1>Create new Plant</h1>
        </>
    )
}
