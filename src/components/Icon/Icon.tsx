import React from "react"
import {Icon} from "@chakra-ui/react"


interface IProps {
  color:string
}

const IconComponent:React.FC<IProps> = ({color}) => (
    <Icon viewBox="0 0 200 200" color={color}>
    <path
      fill={color}
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
</Icon>
)

export default IconComponent