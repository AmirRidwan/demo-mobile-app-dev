// Define the Movie interface
export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  genre: string;
  rating: number;
  duration: string;
  trailerUrl: string;
  casts: Array<Cast>;
}

// Define the Seat interface
export interface Seat {
  id: string;
  row: string;
  number: number;
  isBooked: boolean;
}

// Define the Screening interface
export interface Screening {
  id: number;
  movieId: number;
  date: string;
  time: string;
  hall: string;
  availableSeats: Seat[];
}

// Define the Booking interface
export interface Booking {
  id: string;
  movie: Movie;
  screening: Screening;
  location: string;
  seats: string[];
  bookingTime: number;
  subtotal: number;
  fnbItems?: BookingFnBItem[];
  fnbTotal?: number;
  grandTotal?: number;
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
}

export interface FnBItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}
export interface BookingFnBItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
export interface Cast {
  name: string;
  character: string;
}

