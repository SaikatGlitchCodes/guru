"use client";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  useEffect(() => {
    supabase
      .rpc('search_tutors', { keyword: query })
      .then(({ data, error }) => {
        if (error) {
          console.error('Search error:', error);
        } else {
          console.log('Tutors:', data);
        }
      });
  }, []);
  return <div className="container mx-auto">Find Tutors</div>;
}
