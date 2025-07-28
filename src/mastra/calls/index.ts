export const adminLoginCall = async (email: string, password: string) => {
  const url = 'https://brightlife-enhancement.onrender.com/api/admin/login';
  const body = {
    email,
    password,
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message,
        token: data.token,
      };
    }
    
    return {
      success: false,
      error: data.message || data.error || `Server returned ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    console.error('Error registering user:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
    });

    console.log("error:", error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const registerEmployeeCall = async (name: string, email: string, jobRole: string, startDate: string) => {
  const url = 'https://brightlife-enhancement.onrender.com/api//employee/addEmployee';
  const body = {
    name,
    email,
    jobRole,
    startDate,
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message,
        token: data.token,
      };
    }
    
    return {
      success: false,
      error: data.message || data.error || `Server returned ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    console.error('Error registering user:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
    });

    console.log("error:", error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const passwordResetCall = async (email: string, newPassword: string) => {
  const url = 'https://brightlife-enhancement.onrender.com/api/admin/reset-password';
  const body = {
    email,
    newPassword,
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    }
    
    return {
      success: false,
      error: data.message || data.error || `Server returned ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    console.error('Error registering user:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
    });

    console.log("error:", error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const fetchEmployeeCall = async (query: string) => {
   let paramName = 'name';
    
    if (query.includes('@')) {
        paramName = 'email';
    } else if (/^[A-Z]{2,3}\d+$/i.test(query)) {
        paramName = 'employeeId';
    }
    
    const url = `https://brightlife-enhancement.onrender.com/api/employee/search?${paramName}=${encodeURIComponent(query)}`;    
  
  try {
    const response = await fetch(url);
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    }
    
    return {
      success: false,
      error: data.message || data.error || `Server returned ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    console.error('Error calculating PTO:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const fetchAllEmployeesCall = async () => {
  const url = 'https://brightlife-enhancement.onrender.com/api/employees';
  
  try {
    const response = await fetch(url);
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        data: data,
      };
    }
    
    return {
      success: false,
      error: data.message || data.error || `Server returned ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    console.error('Error fetching all employees:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};