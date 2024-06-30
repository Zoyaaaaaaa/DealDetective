"use client"

import { exportAndStoreProduct } from '@/libs/actions';
import { FormEvent, useState } from 'react'
export const SearchBar = () => {
    const [searchPrompt,setSearchPrompt]=useState('');
    const [isLoading,setIsLoading]=useState(false)
    const isValidURL=(url:string)=>{
            try{
                const parsedURL=new URL(url);
                const hostname=parsedURL.hostname;

                if(hostname.includes('amazon.com')||hostname.includes('amazon.')||hostname.endsWith('amazon.com')){
                    return true;
                }
            }catch(error){
                return false;
            }
            
    }
  
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const isValidLink = isValidURL(searchPrompt);
    
        if(!isValidLink) return alert('Please provide a valid Amazon link')
    
        try {
          setIsLoading(true);
    
          // Scrape the product page
          const product = await exportAndStoreProduct(searchPrompt);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    return (
    <div>
        <form className='flex flex-wrap mt-12' onSubmit={handleSubmit}>
        <input type="text" value={searchPrompt} onChange={(e)=>setSearchPrompt(e.target.value)} placeholder="Enter product link" className="searchbar-input"></input>
        <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
        </form>


    </div>
  )
}
