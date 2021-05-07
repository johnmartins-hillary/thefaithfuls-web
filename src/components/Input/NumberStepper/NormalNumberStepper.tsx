import React from "react"
import {
  Flex, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, Slider,
  NumberDecrementStepper, SliderTrack, SliderFilledTrack,
  SliderThumb, Text
} from "@chakra-ui/react"



interface NormalStepperProps {
  defaultValue?: number;
  minValue: number;
  maxValue: number;
  value: number;
  label: string
  onChange: (value: string | number) => any
}


const SliderInput: React.FC<NormalStepperProps> = ({
  defaultValue, maxValue, minValue,
  onChange, value, label
}) => {
  // const [value, setValue] = React.useState(0)
  // const handleChange = (value:string | number) => setValue(Number(value))

  return (
    <Flex alignItems="center">
      <Text mr={3}>
        {label}
      </Text>
      <NumberInput maxW="100px" defaultValue={defaultValue}
        max={maxValue} min={minValue}
        mr="2rem" value={value} onChange={onChange}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Slider flex="1" focusThumbOnChange={false}
        min={minValue} max={maxValue}
        value={value} onChange={onChange}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm" boxSize="32px" children={value} />
      </Slider>
    </Flex>
  )
}


export default SliderInput