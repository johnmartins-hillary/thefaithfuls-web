import { Tag, TagLabel, TagCloseButton } from "@chakra-ui/react"
import React from "react"

interface ITag<T> {
    // remove:void;
    remove:any;
    name:T;
    [key:string]:any
}

function TagComponent<T>({name,remove,...props}:ITag<T>){
    return(
        <Tag
            size="lg" mx={1} bgColor="chipBackgroundColor"
            borderRadius="full"
            variant="solid" color="inputColor"
            {...props}
        >
            <TagLabel color="inputColor" >{name}</TagLabel>
            <TagCloseButton borderRadius="50%" onClick={(remove as any)}
             padding="auto" color="chipBackgroundColor"
                bgColor="chipDeleteColor"/>
        </Tag>
    )
}


export default TagComponent