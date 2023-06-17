<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Validator;
use Storage;
use App\Models\User;
class CategoryController extends Controller
{
    function image_resize($width, $height, $path, $inputName)
    {
        list($w,$h)=getimagesize($_FILES[$inputName]['tmp_name']);
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
        $imgString=file_get_contents($_FILES[$inputName]['tmp_name']);
        $image=imagecreatefromstring($imgString);
        //нове зображення
        $tmp=imagecreatetruecolor($width,$height);
        imagecopyresampled($tmp, $image,
            0,0,
            0,0,
            $width, $height,
            $w, $h);
        //Зберегти зображення у файлову систему
        switch($_FILES[$inputName]['type'])
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
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'select']]);
    }
    /**
     * @OA\Get(
     *     tags={"Category"},
     *     path="/api/category/select",
     *   security={{ "bearerAuth": {} }},
     *     @OA\Response(response="200", description="List Categories.")
     * )
     */
    public function select()
    {
        $list = Category::all();
        return response()->json($list,200);
    }
    /**
     * @OA\Get(
     *     tags={"Category"},
     *     path="/api/category",
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         required=true,
     *         @OA\Schema(
     *             type="string"
     *         ),
     *         description="Page number default 1"
     *     ),
     *     @OA\Response(response="200", description="List Categories.")
     * )
     */
    public function index()
    {
        $list = Category::paginate(2);
        return response()->json($list,200);
    }
    /**
     * @OA\Post(
     *     tags={"Category"},
     *     path="/api/category",
     *     security={{ "bearerAuth": {} }},
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"image", "name"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Add Category.")
     * )
     * @OA\SecurityScheme(
     *   type="http",
     *   securityScheme="bearerAuth",
     *   scheme="bearer",
     *   bearerFormat="JWT"
     * )
     */

    public function store(Request $request)
    {
        //отримуємо дані із запиту(name, image, description)
        $input = $request->all();
        $messages = array(
            'name.required' => 'Вкажіть назву категорії!',
            'description.required' => 'Вкажіть опис категорії!',
            'image.required' => 'Оберіть фото категорії!'
        );
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required',
            'image' => 'required',
        ], $messages);

        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $filename = uniqid().'.'.$request->file("image")->getClientOriginalExtension();
        $sizes = [50, 150, 300, 600, 1200];
        $dir = $_SERVER['DOCUMENT_ROOT'];

        foreach ($sizes as $size) {
            $file_save = $dir."/uploads/".$size."_".$filename;
            $this->image_resize($size,$size,$file_save, 'image');
        }

        //Storage::disk('local')->put("public/uploads/".$filename,file_get_contents($request->file("image")));
        $input["image"] = $filename;
        $category = Category::create($input);
        return response()->json($category);
    }
    /**
     * @OA\Delete(
     *     tags={"Category"},
     *     path="/api/category/delete/{id}",
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the category to delete",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\Response(response="200", description="Delete Category.")
     * )
     */
    public function destroy($id)
    {
        $file =  Category::findOrFail($id);
        $sizes = [50, 150, 300, 600, 1200];
        foreach ($sizes as $size) {
            $fileName = $_SERVER['DOCUMENT_ROOT'].'/uploads/'.$size.'_'.$file["image"];
            if (is_file($fileName)) {
                unlink($fileName);
            }
        }
        $file->delete();

        // Опціонально поверніть відповідь або редиректіть користувача
    }

    public function indexId($id){
        return $file = Category::findOrFail($id);
    }
    /**
     * @OA\Post(
     *     tags={"Category"},
     *     path="/api/category/edit/{id}",
     *     security={{ "bearerAuth": {} }},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the category to update",
     *         required=true,
     *         @OA\Schema(
     *             type="integer",
     *             format="int64"
     *         )
     *     ),
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"name"},
     *                 @OA\Property(
     *                     property="image",
     *                     type="string",
     *                     format="binary"
     *                 ),
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string"
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Update Category.")
     * )
     */

    public function edit($id, Request $request)
    {
        //отримуємо дані із запиту(name, image, description)
        $input = $request->all();
        $file = Category::findOrFail($id);

        $messages = array(
            'name.required' => 'Вкажіть назву категорії!',
            'description.required' => 'Вкажіть опис категорії!'

        );
        $validator = Validator::make($input, [
            'name' => 'required',
            'description' => 'required'

        ], $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $newFileName = uniqid().'.'.$request->file("image")->getClientOriginalExtension();
        $sizes = [50, 150, 300, 600, 1200];
        foreach ($sizes as $size) {
            $fileName = $_SERVER['DOCUMENT_ROOT'].'/uploads/'.$size.'_'.$file["image"];
            if (is_file($fileName)) {
                unlink($fileName);
            }
            $this->image_resize($size,$size,$_SERVER['DOCUMENT_ROOT'].'/uploads/'.$size.'_'.$newFileName, 'image');
        }
        $file->image = $newFileName;
        $file->name = $input['name'];
        $file->description = $input['description'];
        $file->save();

        return response()->json($file);
    }
}
