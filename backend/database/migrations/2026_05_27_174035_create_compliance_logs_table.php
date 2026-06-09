<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('compliance_logs', function (Blueprint $table) {
            $table->id();
            $table->string('guest_name');
            $table->string('room');
            $table->string('violation_type');
            $table->text('description');
            $table->string('action_taken')->nullable();
            $table->enum('severity', ['low', 'medium', 'high'])->default('medium');
            $table->foreignId('logged_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('compliance_logs');
    }
};