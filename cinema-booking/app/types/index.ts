// Define the Movie interface
export interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  genre: string;
  rating: number;
  duration: string;
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
  seats: string[];
  bookingTime: number;
}
