package com.example.kotlin

// Data class with constructor val/var
data class Product(val id: String, var price: Double)

object AppConfig {
    const val VERSION = "1.0.0"
}

sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
}

class RawStringTest {
    companion object {
        fun getTemplate(name: String): String {
            // Raw string containing braces and string interpolation
            return """
                {
                    "user": "${name}",
                    "status": "active"
                }
            """.trimIndent()
        }
    }
}