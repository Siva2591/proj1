version: '3.8'
services:
  client:
    build:
      context: ./client
    ports:
      - "80:80"
    networks:
      - touchlessap-network

  server:
    build:
      context: ./server
    ports:
      - "3000:3000"
    networks:
      - touchlessap-network
    depends_on:
      - client

networks:
  touchlessap-network:
    driver: bridge
