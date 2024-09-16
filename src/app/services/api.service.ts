import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  // Generic method to handle the response
  private handleResponse(response: Response) {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }

  // Generic method to handle errors
  private handleError(error: any) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }

  // GET method
  getData(url: string): Promise<any> {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // POST method
  postData(url: string, data: any): Promise<any> {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // PUT method
  putData(url: string, data: any): Promise<any> {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // PATCH method
  patchData(url: string, data: any): Promise<any> {
    return fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  // DELETE method
  deleteData(url: string): Promise<any> {
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(this.handleResponse)
      .catch(this.handleError);
  }
}
