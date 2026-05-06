import { onValue, query, QueryConstraint, ref } from 'firebase/database';
import { useEffect, useState } from 'react';

import { firebaseDb } from '@/services/firebase/config';

/**
 * Custom Hook để lắng nghe dữ liệu thời gian thực từ Firebase
 * @param path Đường dẫn đến nhánh dữ liệu (vd: 'notifications/' hoặc 'customers/')
 */
export function useFirebaseRealtime<T = any>(
  path: string,
  options?: {
    queryConstraints?: QueryConstraint[];
  },
) {
  // Để mặc định là null hoặc T thay vì mảng rỗng nếu là lắng nghe ID đơn lẻ
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const dbRef = ref(firebaseDb, path);
    const queryRef = query(dbRef, ...(options?.queryConstraints || []));

    const unsubscribe = onValue(
      queryRef,
      (snapshot) => {
        const rawData = snapshot.val();

        if (rawData) {
          // Nếu path trỏ đến danh sách (kết thúc bằng /) thì ép về mảng
          // Nếu path trỏ đến ID cụ thể thì giữ nguyên Object
          if (path.endsWith('/') && typeof rawData === 'object') {
            setData(Object.values(rawData) as T[]);
          } else {
            setData(rawData as T);
          }
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options?.queryConstraints), path]);

  return { data, loading, error };
}
