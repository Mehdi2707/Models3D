import {useEffect, useRef, useState} from "react";

export function useDocumentTitle(title) {

    const titleRef = useRef(document.title)

    useEffect(() => {
        //const originalTitle = document.title
        return () => {
            document.title = titleRef.current
        }
    }, [])

    useEffect(() => {
        document.title = title ? title : titleRef.current
    }, [title])
}
