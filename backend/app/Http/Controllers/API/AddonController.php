<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Addon;
use Illuminate\Http\Request;

class AddonController extends Controller
{
    public function index(Request $request)
    {
        $query = Addon::query();
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('category', 'like', "%{$request->search}%");
            });
        }
        
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        $addons = $query->get();
        
        return response()->json([
            'data' => $addons,
            'categories' => Addon::distinct('category')->pluck('category'),
        ]);
    }

    public function getCategories()
    {
        return response()->json(Addon::distinct('category')->pluck('category'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'nullable|string',
            'max_guests' => 'nullable|integer',
        ]);

        $addon = Addon::create($request->all());
        
        return response()->json($addon, 201);
    }

    public function update(Request $request, $id)
    {
        $addon = Addon::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
        ]);

        $addon->update($request->all());
        
        return response()->json($addon);
    }

    public function toggleStatus($id)
    {
        $addon = Addon::findOrFail($id);
        $addon->update(['status' => $addon->status === 'active' ? 'inactive' : 'active']);
        
        return response()->json($addon);
    }

    public function archive($id)
    {
        $addon = Addon::findOrFail($id);
        $addon->update(['status' => 'inactive']);
        
        return response()->json(['message' => 'Add-on archived']);
    }

    public function restore($id)
    {
        $addon = Addon::withTrashed()->findOrFail($id);
        $addon->restore();
        $addon->update(['status' => 'active']);
        
        return response()->json(['message' => 'Add-on restored']);
    }

    public function destroy($id)
    {
        $addon = Addon::findOrFail($id);
        $addon->delete();
        
        return response()->json(['message' => 'Add-on deleted']);
    }
}