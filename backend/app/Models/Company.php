<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Company extends Model
{
    protected $fillable = [
        'name',
        'cnpj',
        'address',
    ];

    /**
     * Relacionamento many-to-many com Employees
     */
    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'company_employee');
    }

    /**
     * Relacionamento many-to-many com Customers
     */
    public function customers(): BelongsToMany
    {
        return $this->belongsToMany(Customer::class, 'company_customer');
    }
}
