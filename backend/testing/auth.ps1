# Get authentication token first
$loginData = @{
    "username" = "your_username"
    "password" = "your_password"
} | ConvertTo-Json

$tokenResponse = Invoke-RestMethod -Uri "$baseUrl/token/" -Method Post -Body $loginData -ContentType "application/json"
$token = $tokenResponse.access

# Add token to headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Use headers in your test functions
function Test-EmailSettings {
    Write-Host "`nVerifying Email Settings..."
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/email-settings/" -Method Get -Headers $headers
        Write-Host "Email Settings:"
        Write-Host "HOST: $($response.EMAIL_HOST)"
        Write-Host "PORT: $($response.EMAIL_PORT)"
        Write-Host "TLS: $($response.EMAIL_USE_TLS)"
        Write-Host "USER: $($response.EMAIL_HOST_USER)"
    }
    catch {
        Write-Host "Failed to verify email settings: $($_.Exception.Message)"
    }
}