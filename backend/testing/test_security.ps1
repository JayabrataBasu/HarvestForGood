# test_security.ps1

# Base URL - Make sure it's a complete URL
$baseUrl = "http://localhost:8000"

# Get token first
$loginData = @{
    "username" = "jayabasu"
    "password" = "Chin2b@su"
} | ConvertTo-Json

Write-Host "Authenticating..."
try {
    $tokenResponse = Invoke-RestMethod -Uri "$baseUrl/api/token/" -Method Post -Body $loginData -ContentType "application/json"
    $token = $tokenResponse.access
    Write-Host "Authentication successful"
} catch {
    Write-Host "Authentication failed: $($_.Exception.Message)"
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Function to test rate limiting
function Test-RateLimiting {
    Write-Host "`nTesting Rate Limiting..."
    for ($i = 1; $i -le 12; $i++) {
        try {
            $response = Invoke-RestMethod -Uri "$baseUrl/api/forum/posts/" -Method Get -Headers $headers
            Write-Host "Request ${i} succeeded"
        }
        catch {
            Write-Host "Request ${i} failed - Rate limit reached: $($_.Exception.Message)"
            break
        }
        Start-Sleep -Milliseconds 100
    }
}

# Function to test CORS
function Test-CORS {
    Write-Host "`nTesting CORS..."
    
    $corsHeaders = @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "GET"
    }
    
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl/api/forum/posts/" -Method Options -Headers $corsHeaders
        Write-Host "CORS Headers:"
        Write-Host "Allow-Origin: $($response.Headers.'Access-Control-Allow-Origin')"
        Write-Host "Allow-Methods: $($response.Headers.'Access-Control-Allow-Methods')"
    }
    catch {
        Write-Host "CORS test failed: $($_.Exception.Message)"
    }
}

# Function to test content validation
function Test-ContentValidation {
    Write-Host "`nTesting Content Validation..."
    
    # Test invalid post content
    $invalidPost = @{
        "title" = "Test"
        "content" = "Short"
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/api/forum/posts/" -Method Post -Headers $headers -Body $invalidPost
        Write-Host "Validation test failed - Invalid content was accepted"
    }
    catch {
        Write-Host "Validation test passed - Invalid content was rejected"
        Write-Host "Error details: $($_.Exception.Message)"
    }
}

# Run all tests
Write-Host "Starting Security Tests`n"
Test-RateLimiting
Test-CORS
Test-ContentValidation
Write-Host "`nSecurity Tests Completed"
