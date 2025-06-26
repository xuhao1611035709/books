-- 创建books表
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  author text,
  isbn text,
  category text,
  status text, -- 状态: available(可借阅) 或 borrowed(已借出)
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);