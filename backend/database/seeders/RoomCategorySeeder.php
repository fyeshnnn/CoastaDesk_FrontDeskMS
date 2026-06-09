<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RoomCategory;
use Illuminate\Support\Facades\DB;

class RoomCategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Single Cottage', 'type' => 'single', 'base_price' => 4800, 'default_capacity' => 4],
            ['name' => 'Hotel Room', 'type' => 'hotel', 'base_price' => 4800, 'default_capacity' => 4],
            ['name' => 'Dormitory', 'type' => 'dormitory', 'base_price' => 13000, 'default_capacity' => 10],
            ['name' => 'Duplex', 'type' => 'duplex', 'base_price' => 9000, 'default_capacity' => 6],
            ['name' => 'Villa', 'type' => 'villa', 'base_price' => 20000, 'default_capacity' => 10],
            ['name' => 'Cottage', 'type' => 'cottage', 'base_price' => 4800, 'default_capacity' => 4],
        ];

        foreach ($categories as $category) {
            RoomCategory::create($category);
        }
    }
}