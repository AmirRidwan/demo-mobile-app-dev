// Define the Movie interface
export interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: string;
  rating: number;
  posterUrl: string;
  trailerUrl?: string;
  casts: Cast[];
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
  hall: string;
  date: string;
  time: string;
  availableSeats?: Seat[];
}

// Define the Booking interface
export interface Booking {
  id: string;
  movieId: number;
  screeningId: number;
  movie: {
    id: number;
    title: string;
    posterUrl: string;
    genre?: string;
    duration?: string;
  };
  screening: {
    hall: string;
    date: string;
    time: string;
  };
  location: string;
  seats: string[];
  bookingTime: number;
  subtotal: number;
  fnbItems?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  fnbTotal?: number;
  serviceCharge?: number;
  grandTotal?: number;
  paid?: boolean;
  paymentDate?: string;
}

// Define the Review interface
export interface Review {
  id: number;
  movieId: number;
  username: string;
  rating: number;
  comment: string;
}

// Define the FnBItem interface
export interface FnBItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  category: string;
}

// Define the BookingFnBItem interface
export interface BookingFnBItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Define the Cast interface
export interface Cast {
  name: string;
  character: string;
}
