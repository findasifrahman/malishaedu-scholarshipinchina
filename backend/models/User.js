const db = require('../database/connection');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { password, ...userInfo } = userData;
    const password_hash = await bcrypt.hash(password, 12);
    
    const [user] = await db('users')
      .insert({ ...userInfo, password_hash })
      .returning('*');
    
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async findByEmail(email) {
    return await db('users').where({ email }).first();
  }

  static async findByUsername(username) {
    return await db('users').where({ username }).first();
  }

  static async findByPhone(phone) {
    return await db('users').where({ phone }).first();
  }

  static async findById(id) {
    const user = await db('users').where({ id }).first();
    if (user) {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  static async update(id, updates) {
    const [user] = await db('users')
      .where({ id })
      .update(updates)
      .returning('*');
    
    if (user) {
      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  static async updatePassword(id, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 12);
    return await db('users')
      .where({ id })
      .update({ password_hash });
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async getAll(limit = 50, offset = 0) {
    const users = await db('users')
      .select(
        'users.id', 
        'users.email', 
        'users.first_name', 
        'users.last_name', 
        'users.role', 
        'users.is_verified', 
        'users.created_at',
        'users.address',
        'users.city',
        'users.with_scholarship'
      )
      .limit(limit)
      .offset(offset)
      .orderBy('users.created_at', 'desc');
    
    const total = await db('users').count('* as count').first();
    
    return {
      users,
      total: parseInt(total.count),
      limit,
      offset
    };
  }

  static async getAppliedPrograms(userId) {
    const StudentProgram = require('./StudentProgram');
    return await StudentProgram.findByUserId(userId);
  }

  static async applyToProgram(userId, programId) {
    const StudentProgram = require('./StudentProgram');
    return await StudentProgram.create(userId, programId);
  }

  static async removeFromProgram(userId, programId) {
    const StudentProgram = require('./StudentProgram');
    return await StudentProgram.delete(userId, programId);
  }

  static async delete(id) {
    return await db('users').where({ id }).del();
  }
}

module.exports = User;
