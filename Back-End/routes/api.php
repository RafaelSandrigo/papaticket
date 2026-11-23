<?php

use App\Http\Controllers\Admin\OrganizerProfileController;
use App\Http\Controllers\Admin\RaceController as AdminRaceController;
use App\Http\Controllers\Admin\RaceRegistrationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RaceController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::apiResource('races', RaceController::class)->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::apiResource('registrations', RegistrationController::class)->only(['index', 'store', 'destroy']);

    Route::prefix('admin')->group(function () {
        Route::apiResource('races', AdminRaceController::class)->names('admin.races');
        Route::get('races/{race}/registrations', [RaceRegistrationController::class, 'index']);
        Route::get('profile', [OrganizerProfileController::class, 'show']);
        Route::put('profile', [OrganizerProfileController::class, 'update']);
    });
});
