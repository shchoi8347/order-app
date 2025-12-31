// src/data.js

export const mockMenuItems = [
  {
    id: 1,
    name: "아메리카노 (ICE)",
    price: 4000,
    description: "시원하고 깔끔한 맛",
    options: [
      { name: "샷 추가", price: 500 },
      { name: "시럽 추가", price: 0 },
    ],
  },
  {
    id: 2,
    name: "아메리카노 (HOT)",
    price: 4000,
    description: "따뜻하고 부드러운 맛",
    options: [
      { name: "샷 추가", price: 500 },
      { name: "시럽 추가", price: 0 },
    ],
  },
  {
    id: 3,
    name: "카페라떼",
    price: 5000,
    description: "고소한 우유의 조화",
    options: [
      { name: "샷 추가", price: 500 },
      { name: "시럽 추가", price: 0 },
    ],
  },
  {
    id: 4,
    name: "바닐라 라떼",
    price: 5500,
    description: "달콤한 바닐라 시럽",
    options: [
      { name: "샷 추가", price: 500 },
      { name: "휘핑 추가", price: 300 },
    ],
  },
];

export const initialInventory = mockMenuItems.map((item) => ({
  ...item,
  stock: 10,
}));
