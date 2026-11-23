<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('runner_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('cpf', 11)->unique();
            $table->date('birth_date');
            $table->enum('gender', ['M', 'F']);
            $table->string('phone', 20);
            $table->string('emergency_contact_name');
            $table->string('emergency_contact_phone', 20);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('runner_profiles');
    }
};
