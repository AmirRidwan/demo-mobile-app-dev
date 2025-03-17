<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class SeatLocked implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $seatId;
    public $seatNumber;
    public $status;
    public $userId;
    public $username;

    public function __construct($seat)
    {
        $this->seatId = $seat->id;
        $this->seatNumber = $seat->seat_number;
        $this->status = $seat->status;
        $this->userId = auth()->id() ?? 'Guest';
        $this->username = auth()->user()->name ?? 'Guest';
    }

    public function broadcastOn()
    {
        return ['seats'];
    }

    public function broadcastAs()
    {
        return 'seat.locked';
    }

    public function broadcastWith()
    {
        return [
            'seatId' => $this->seatId,
            'seatNumber' => $this->seatNumber,
            'status' => $this->status,
            'userId' => $this->userId,
            'username' => $this->username,
        ];
    }
}
