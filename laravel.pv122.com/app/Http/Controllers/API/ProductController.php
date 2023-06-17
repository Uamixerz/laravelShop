<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ImagesProduct;
use App\Models\Product;
use App\Models\Product_images;
use Illuminate\Http\Request;
use Validator;
use Storage;

use App\Models\User;
class ProductController extends Controller
{
    function image_resize($width, $height, $path, $inputName, $index)
    {
        list($w,$h)=getimagesize($_FILES[$inputName]['tmp_name'][$index]);
        $maxSize=0;
        if(($w>$h)and ($width>$height))
            $maxSize=$width;
        else
            $maxSize=$height;
        $width=$maxSize;
        $height=$maxSize;
        $ration_orig=$w/$h;
        if(1>$ration_orig)
            $width=ceil($height*$ration_orig);
        else
            $height=ceil($width/$ration_orig);
        //отримуємо файл
        $imgString=file_get_contents($_FILES[$inputName]['tmp_name'][$index]);
        $image=imagecreatefromstring($imgString);
        //нове зображення
        $tmp=imagecreatetruecolor($width,$height);
        imagecopyresampled($tmp, $image,
            0,0,
            0,0,
            $width, $height,
            $w, $h);
        //Зберегти зображення у файлову систему
        switch($_FILES[$inputName]['type'][$index])
        {
            case 'image/jpeg':
                imagejpeg($tmp,$path,30);
                break;
            case 'image/png':
                imagepng($tmp,$path,0);
                break;
            case 'image/gif':
                imagegif($tmp, $path);
                break;
        }
        return $path;
        //очисчаємо память
        imagedestroy($image);
        imagedestroy($tmp);
    }
    public function store(Request $request)
    {
        //отримуємо дані із запиту(name, images, description)
        $input = $request->all();
        $messages = array(
            'name.required' => 'Вкажіть назву категорії!',
            'description.required' => 'Вкажіть опис категорії!',
            'images.required' => 'Оберіть фото категорії!',
            'category_id.required' => 'Оберіть id category'
        );
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required',
            'images' => 'required',
            'category_id' => 'required',
        ], $messages);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category_id' => $request->category_id,
        ]);

        foreach ($input["images"] as $index => $image) {
            $filename = uniqid() . '.' . $image->getClientOriginalExtension();
            $sizes = [50, 150, 300, 600, 1200];
            $dir = $_SERVER['DOCUMENT_ROOT'];

            foreach ($sizes as  $size) {
                $file_save = $dir . "/uploads/" . $size . "_" . $filename;
                $this->image_resize($size, $size, $file_save, 'images', $index);
            }
            $id_id = $product->id;
            $image_th = Product_images::create([
                'product_id' => $product->id,
                'name' => $filename,
                'priority' => $index+1,
            ]);
        }

        //Storage::disk('local')->put("public/uploads/".$filename,file_get_contents($request->file("image")));
        //$input["image"] = $filename;
        //$category = Category::create($input);
        return response()->json($product);
    }
}
