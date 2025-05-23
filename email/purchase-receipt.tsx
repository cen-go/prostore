import sampleData from "@/db/sample-data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Order } from "@/types";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type OrderInformationProps = {
  order: Order;
};

PurchaseReceiptEmail.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: '123',
    user: {
      name: 'John Doe',
      email: 'test@test.com',
    },
    paymentMethod: 'Stripe',
    shippingAddress: {
      addressTitle: "Home",
      fullName: 'John Doe',
      streetAddress: '123 Main st',
      city: 'New York',
      postalCode: '10001',
      country: 'US',
    },
    createdAt: new Date(),
    totalPrice: '100',
    taxPrice: '10',
    shippingPrice: '10',
    itemsPrice: '80',
    orderItems: sampleData.products.map((x) => ({
      name: x.name,
      orderId: '123',
      productId: '123',
      slug: x.slug,
      qnty: x.stock,
      image: x.images[0],
      price: x.price.toString(),
    })),
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    paymentResult: {
      id: '123',
      status: 'succeeded',
      pricePaid: '100',
      email_address: 'test@test.com',
    },
  },
} satisfies OrderInformationProps;

export default function PurchaseReceiptEmail({order}: OrderInformationProps) {
  
  return (
    <Html>
      <Preview>View order receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-600 whitespace-nowrap text-nowrap">
                    Order ID
                  </Text>
                  <Text className="mt-0 mr-4">{order.id}</Text>
                </Column>
                <Column align="right">
                  <Text className="mb-0 mr-4 text-gray-600 whitespace-nowrap text-nowrap">
                    Purchase Date
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatDateTime(order.createdAt).dateTime}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6">
              {order.orderItems.map((item) => (
                <Row key={item.productId} className="mt-6">
                  <Column className="w-20">
                    <Img
                      width={80}
                      alt={item.name}
                      src={
                        item.image.startsWith("/")
                          ? `https://prostore-rho-one.vercel.app/${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-middle">{item.name} x {item.qnty}</Column>
                  <Column align="right" className="align-middle">{item.price}</Column>
                </Row>
              ))}
              {[
                {name: "Items", price: order.itemsPrice},
                {name: "Tax", price: order.taxPrice},
                {name: "Shipping", price: order.shippingPrice},
                {name: "Total", price: order.totalPrice},
              ].map(({name, price}) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}:{" "}</Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}