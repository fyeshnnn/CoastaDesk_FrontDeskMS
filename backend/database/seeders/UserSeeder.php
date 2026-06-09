<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@costamarina.com',
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::create([
            'first_name' => 'Manager',
            'last_name' => 'User',
            'email' => 'manager@costamarina.com',
            'username' => 'manager',
            'password' => Hash::make('manager123'),
            'role' => 'manager',
            'status' => 'active',
        ]);

        User::create([
            'first_name' => 'Staff',
            'last_name' => 'User',
            'email' => 'staff@costamarina.com',
            'username' => 'staff',
            'password' => Hash::make('staff123'),
            'role' => 'staff',
            'status' => 'active',
        ]);

        User::create([
            'first_name' => 'Customer',
            'last_name' => 'User',
            'email' => 'customer@costamarina.com',
            'username' => 'customer',
            'password' => Hash::make('customer123'),
            'role' => 'customer',
            'status' => 'active',
        ]);
    }
}