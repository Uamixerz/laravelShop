<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Product extends Model
{
    use HasFactory;
    public function photos()
    {
        return $this->hasMany(ImagesProduct::class);
    }
    protected $fillable=[
        'id',
        'name',
        'price',
        'description',
        'category_id',
    ];
}
