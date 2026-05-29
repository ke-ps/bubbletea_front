export type BubbleTea = {
  id: string;
  name: string;
  flavor: string;
  price: number;
  description: string;
  imageUrl: string;
};

export const bubbleTeas: BubbleTea[] = [
  {
    id: '1',
    name: 'Classic Milk Tea',
    flavor: 'Black tea, milk and tapioca pearls',
    price: 4.5,
    description: 'The classic bubble tea with black tea, creamy milk and chewy tapioca pearls.',
    imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Matcha Bubble Tea',
    flavor: 'Matcha, milk and tapioca pearls',
    price: 5,
    description: 'A soft matcha drink with milk and tapioca pearls.',
    imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Strawberry Tea',
    flavor: 'Strawberry, green tea and popping boba',
    price: 4.8,
    description: 'A fruity bubble tea with strawberry flavor and popping boba.',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=800&auto=format&fit=crop',
  },
];