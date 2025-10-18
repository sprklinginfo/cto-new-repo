import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from '@chakra-ui/react'
import type { Feature } from '../data/features'

type FeatureCardProps = {
  feature: Feature
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <Card
      variant="outline"
      bg="white"
      height="full"
      borderRadius="xl"
      borderColor="gray.100"
      shadow="sm"
    >
      <CardHeader>
        <Heading size="md" color="brand.600">
          {feature.title}
        </Heading>
      </CardHeader>
      <CardBody>
        <Text color="gray.600">{feature.description}</Text>
      </CardBody>
      <CardFooter>
        <Button colorScheme="brand" variant="solid">
          {feature.cta}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default FeatureCard
