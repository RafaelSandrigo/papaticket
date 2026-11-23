<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrganizerProfileRequest;
use App\Http\Resources\OrganizerProfileResource;
use Illuminate\Http\Request;

class OrganizerProfileController extends Controller
{
    public function show(Request $request)
    {
        abort_unless($request->user()->isOrganizer(), 403);

        return new OrganizerProfileResource($request->user()->organizerProfile()->firstOrNew());
    }

    public function update(UpdateOrganizerProfileRequest $request)
    {
        $profile = $request->user()->organizerProfile()->updateOrCreate([], $request->validated());

        return new OrganizerProfileResource($profile);
    }
}
