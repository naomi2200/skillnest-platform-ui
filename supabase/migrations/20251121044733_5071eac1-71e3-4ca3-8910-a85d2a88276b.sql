-- Create storage buckets for course content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('course-videos', 'course-videos', true, 524288000, ARRAY['video/mp4', 'video/webm', 'video/ogg']),
  ('course-resources', 'course-resources', true, 52428800, ARRAY['application/pdf', 'application/zip', 'application/x-zip-compressed']);

-- Storage policies for course videos
CREATE POLICY "Anyone can view course videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-videos');

CREATE POLICY "Mentors can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-videos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Mentors can update their videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-videos' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Mentors can delete their videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-videos' 
  AND auth.uid() IS NOT NULL
);

-- Storage policies for course resources
CREATE POLICY "Anyone can view course resources"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-resources');

CREATE POLICY "Mentors can upload resources"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'course-resources' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Mentors can update their resources"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'course-resources' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Mentors can delete their resources"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'course-resources' 
  AND auth.uid() IS NOT NULL
);