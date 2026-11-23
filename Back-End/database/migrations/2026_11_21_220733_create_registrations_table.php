<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('race_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['confirmed', 'cancelled'])->default('confirmed');
            $table->enum('shirt_size', ['PP', 'P', 'M', 'G', 'GG', 'XG']);
            $table->dateTime('registered_at');
            $table->timestamps();
            $table->unique(['user_id', 'race_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
