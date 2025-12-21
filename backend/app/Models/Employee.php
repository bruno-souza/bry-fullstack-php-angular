<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class Employee extends Model
{
    protected $fillable = [
        'login',
        'name',
        'cpf',
        'email',
        'address',
        'password',
        'document_path',
    ];

    protected $hidden = [
        'password',
    ];

    protected $appends = [
        'document_url',
    ];

    /**
     * Relacionamento many-to-many com Companies
     */
    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_employee');
    }

    /**
     * Retorna a URL completa do documento
     */
    protected function documentUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->document_path 
                ? url('storage/' . $this->document_path)
                : null,
        );
    }
}
